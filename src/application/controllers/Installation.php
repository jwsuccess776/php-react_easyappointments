<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2018, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.1.0
 * ---------------------------------------------------------------------------- */

/**
 * Installation Controller
 *
 * This controller will handle the installation procedure of Easy!Appointments
 *
 * @package Controllers
 */
class Installation extends CI_Controller {
    /**
     * Class Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->helper('installation');
        $this->load->helper('security');
        $this->load->library('session');

        // Set user's selected language.
        if ($this->session->userdata('language'))
        {
            $this->config->set_item('language', $this->session->userdata('language'));
            $this->lang->load('translations', $this->session->userdata('language'));
        }
        else
        {
            $this->lang->load('translations', $this->config->item('language')); // default
        }
    }

    /**
     * Display the installation page.
     */
    public function index()
    {
        if (is_ea_installed())
        {
            redirect('appointments/index');
            return;
        }

        $this->load->view('general/installation', [
            'base_url' => $this->config->item('base_url')
        ]);
    }

    /**
     * [AJAX] Installs Easy!Appointments on the server.
     *
     * Required POST Parameters
     *
     * - array $_POST['admin'] Contains the initial admin user data. The App needs at least one admin user to work.
     * - array $_POST['company'] Contains the basic company data.
     */
    public function ajax_install()
    {
        try {
            if (is_ea_installed()) {
                return;
            }


            $payload = $this->input->post('payload');

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

            // print_r($company_url); exit;
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($company_url));

        } catch (Exception $exc) {
            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['exceptions' => [exceptionToJavaScript($exc)]]));
        }
    }
}
