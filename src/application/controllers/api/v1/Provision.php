<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2018, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.2.0
 * ---------------------------------------------------------------------------- */

require_once __DIR__ . '/API_V1_Controller.php';

use \EA\Engine\Api\V1\Response;
use \EA\Engine\Api\V1\Request;
use \EA\Engine\Types\NonEmptyText;

/**
 * Admins Controller
 *
 * @package Controllers
 * @subpackage API
 */
class Provision extends API_V1_Controller {
    /**
     * Class Constructor
     */
    public function __construct()
    {
        $args = [];

        if ( false == stripos($_SERVER['REQUEST_URI'], 'appointment') ) {
            $args = ['bypass' => true];
        }

        parent::__construct($args);

        $this->load->helper('installation');
        $this->load->helper('security');
        $this->load->library('session');
        $this->load->model('appointments_model');
        $this->load->model('customers_model');
        $this->load->model('services_model');
        $this->load->model('providers_model');
    }

    public function install()
    {
        if ( ! isset($_SERVER['HTTP_X_API_KEY']) || 'v1' != $_SERVER['HTTP_X_API_KEY'] ) {
            $response = new Response(['exceptions' => 'unknown_error']);
            return $response->output();
        }

        if ( ! isset($_POST['email']) || ! isset($_POST['password']) ) {
            $response = new Response(['exceptions' => 'missing_required_fields']);
            return $response->output();
        }

        $id = uniqid('apitenant_');

        $payload = [
            'practice_name' => $id,
            'email' => $_POST['email'],
            'password' => $_POST['password'],
            'first_name' => 'General',
            'last_name' => 'Provider',
            'practice_phone' => '0123456789',
            'practice_address_1' => 'practice_address_1',
            'practice_state' => 'practice_state',
            'practice_zip' => 'practice_zip',
            'timezone' => isset($_POST['timezone']) ? trim($_POST['timezone']) : 'America/New_York',
            'hours' => isset($_POST['hours']) ? $_POST['hours'] : [],
            'services' => isset($_POST['services']) ? $_POST['services'] : [],
            'providers' => isset($_POST['providers']) ? $_POST['providers'] : [],
            'hours' => isset($_POST['hours']) ? $_POST['hours'] : '',
        ];

        if ( ! empty($payload['services']) ) {
            foreach ($payload['services'] as $key => $service) {
                if ( ! isset($service['name']) ) {
                    $payload['services'][$key]['name'] = 'General Services #' . $key + 1;
                }

                $payload['services'][$key]['attendants_number'] = isset($service['booking_limit']) ? (int) $service['booking_limit'] : 1;
                $payload['services'][$key]['availabilities_type'] = isset($service['availabilities_type']) ? $service['availabilities_type'] : AVAILABILITIES_TYPE_FIXED;
//                $payload['services'][$key]['availabilities_type'] = AVAILABILITIES_TYPE_FLEXIBLE;
//                $payload['services'][$key]['availabilities_type'] = AVAILABILITIES_TYPE_FIXED;
            }
        }

        if ( ! empty($payload['providers']) ) {
            foreach ($payload['providers'] as $key => $provider) {
                $payload['providers'][$key]['first_name'] = isset($provider['first_name']) ? $provider['first_name'] : 'John';
                $payload['providers'][$key]['last_name'] = isset($provider['last_name']) ? $provider['last_name'] : 'Doe';
                $payload['providers'][$key]['phone_number'] = isset($provider['phone_number']) ? $provider['phone_number'] : '0123456789';
                $payload['providers'][$key]['email'] = isset($provider['email']) ? $provider['email'] : "providers+{$key}@plano.com";
            }
        } else {
            $payload['providers'] = [
                'first_name' => 'General',
                'last_name' => 'Provider',
                'phone_number' => '555.555.5555',
                'email' => $id . '@plano.com',
            ];
        }

        try {
            $this->load->model('admins_model');
            $this->load->library('session');
            $this->load->model('settings_model');
            $this->load->model('services_model');
            $this->load->model('providers_model');
            $this->load->model('secretaries_model');
            $this->load->model('settings_model');

            $company_url = provision(
                $payload,
                $this->db,
                $this->admins_model,
                $this->session,
                $this->settings_model,
                $this->services_model,
                $this->providers_model,
                $this->secretaries_model,
                $this->settings_model
            );

            $response = new Response([$company_url]);
            $response->output();

        } catch (Exception $exc) {
            $response = new Response(['exceptions' => [exceptionToJavaScript($exc)]]);
            $response->output();
        }
    }

    public function appointment()
    {
        $this->parser = new \EA\Engine\Api\V1\Parsers\Appointments;

        $id = uniqid('cus_');

        $customer = [
            'first_name' => $id,
            'last_name' => $id,
            'phone_number' => '0123456789',
            'email' => $id . '@plano.com',
        ];

        if ( isset($_POST['cid']) ) {
            $customer['email'] = trim($_POST['cid']) . '@plano.com';

            if ( $this->customers_model->exists($customer) ) {
                $customerId = $this->customers_model->find_record_id($customer);
            } else {
                $customerId = $this->customers_model->add($customer);
            }
        }

        $serviceId = ( isset($_POST['serviceId']) && $_POST['serviceId'] ) ? $_POST['serviceId'] : $this->services_model->get_available_services()[0]['id'];
        $providerId = ( isset($_POST['providerId']) && $_POST['providerId'] ) ? $_POST['providerId'] : $this->providers_model->get_available_providers()[0]['id'];

        $appointment = [
            'start_datetime' => trim($_POST['start']),
            'end_datetime' => trim($_POST['end']),
            'notes' => isset($_POST['notes']) ? trim($_POST['notes']) : null,
            'id_users_customer' => $customerId,
            'id_users_provider' => $providerId,
            'id_services' => $serviceId,
            'is_unavailable' => false,
        ];

        $appointmentId = $this->appointments_model->add($appointment);

        // Fetch the new object from the database and return it to the client.
        $batch = $this->appointments_model->get_batch('id = ' . $appointmentId);
        $response = new Response($batch);
        $status = new NonEmptyText('201 Created');
        $response->encode($this->parser)->singleEntry(TRUE)->output($status);
    }
}
