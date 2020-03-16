<?php defined('BASEPATH') or exit('No direct script access allowed');

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
 * Check if Easy!Appointments is installed.
 *
 * This function will check some factors to determine if Easy!Appointments is
 * installed or not. It is possible that the installation is properly configure
 * without being recognized by this method.
 *
 * Notice: You can add more checks into this file in order to further check the
 * installation state of the application.
 *
 * @return bool Returns whether E!A is installed or not.
 */
function is_ea_installed()
{
    $ci = &get_instance();
    return $ci->db->table_exists('users');
}

/**
 * Get the data of a sample service.
 *
 * @return array
 */
function get_sample_service()
{
    return [
        'name' => 'Test Service',
        'duration' => 30,
        'price' => 50.0,
        'currency' => 'Euro',
        'description' => 'This is a test service automatically inserted by the installer.',
        'availabilities_type' => 'flexible',
        'attendants_number' => 1,
        'id_service_categories' => null,
    ];
}

function populate_service($args)
{
    $service = [
        'name' => $args['name'],
        'duration' => isset($args['duration']) ? $args['duration'] : 60,
        'price' => isset($args['price']) ? $args['price'] : 0,
        'currency' => 'USD',
//        'description' => 'This is a test service automatically inserted by the installer.',
        'availabilities_type' => 'flexible',
        'attendants_number' => isset($args['attendants_number']) ? $args['attendants_number'] : 1,
        'id_service_categories' => null,
    ];

    return $service;
}

/**
 * Get the data of a sample provider.
 *
 * @return array
 */
function get_sample_provider()
{
    return [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@doe.com',
        'phone_number' => '0123456789',
        'services' => [],
        'settings' => [
            'username' => 'johndoe',
            'password' => '59fe9d073a9c3c606a7e01e402dca4b49b6aa517bd0fdf940c46cb13a7b63dd0',
            'salt' => 'dc5570debc71fc1fe94b1b0aee444fcde5b8cb83d62a6a2b736ead6557d7a2e1',
            'working_plan' => '{"monday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"tuesday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"wednesday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"thursday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"friday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"saturday":null,"sunday":null}',
            'notifications' => false,
            'google_sync' => false,
            'sync_past_days' => 5,
            'sync_future_days' => 5,
            'calendar_view' => CALENDAR_VIEW_DEFAULT,
        ],
    ];
}

/**
 * Get the data of a sample provider.
 *
 * @return array
 */
function populate_doctor($args = [])
{
    return [
        'first_name' => $args['first_name'],
        'last_name' => $args['last_name'],
        'email' => $args['email'],
        'phone_number' => $args['phone_number'],
        'services' => [],
        'settings' => [
            'username' => $args['email'],
//            'password' => $args['password'],
            //            'salt' => $args['salt'],
            //            'working_plan' => $args['working_plan'],
            //            'working_plan' => '{"monday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"tuesday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"wednesday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"thursday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"friday":{"start":"09:00","end":"18:00","breaks":[{"start":"14:30","end":"15:00"}]},"saturday":null,"sunday":null}',
            'notifications' => false,
            'google_sync' => false,
            'sync_past_days' => 5,
            'sync_future_days' => 5,
            'calendar_view' => CALENDAR_VIEW_DEFAULT,
        ],
    ];
}

/**
 * Get the data of a sample provider.
 *
 * @return array
 */
function populate_staff($args = [])
{
    return [
        'first_name' => $args['first_name'],
        'last_name' => $args['last_name'],
        'email' => $args['email'],
        'phone_number' => $args['phone_number'],
        'providers' => [],
        'settings' => [
            'username' => $args['email'],
            'password' => $args['password'],
//            'salt' => $args['salt'],
            'notifications' => false,
            'google_sync' => false,
            'sync_past_days' => 5,
            'sync_future_days' => 5,
            'calendar_view' => CALENDAR_VIEW_DEFAULT,
        ],
    ];
}

function setup_dir($path)
{
    // Make the tenant directory
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }

    if (!is_writable($path)) {
        chmod($path, 0777);
    }
}

function get_working_plan($schedule)
{
    $working_plan = [];
    foreach ($schedule as $plan) {
        $_today = strtolower($plan['day']);
        $day[$_today] = [];

        if (false == stripos($plan['office_start_time'], '(')) {
            $day[$_today]['start'] = $plan['office_start_time'];
            $day[$_today]['end'] = $plan['office_end_time'];
        } else {
            $day[$_today]['start'] = date('H:i', strtotime(substr($plan['office_start_time'], 0, stripos($plan['office_start_time'], '('))));
            $day[$_today]['end'] = date('H:i', strtotime(substr($plan['office_end_time'], 0, stripos($plan['office_end_time'], '('))));
        }

        if (isset($plan['lunch_start_time']) && isset($plan['lunch_end_time'])) {
            if (false == stripos($plan['lunch_start_time'], '(')) {
                $day[$_today]['breaks'][0]['start'] = date('H:i', strtotime(substr($plan['lunch_start_time'], 0, stripos($plan['lunch_start_time'], '('))));
                $day[$_today]['breaks'][0]['end'] = date('H:i', strtotime(substr($plan['lunch_end_time'], 0, stripos($plan['lunch_end_time'], '('))));
            } else {
                $day[$_today]['breaks'][0]['start'] = $plan['lunch_start_time'];
                $day[$_today]['breaks'][0]['end'] = $plan['lunch_end_time'];
            }
        } else {
            $day[$_today]['breaks'] = null;
        }

        $working_plan = array_merge($day, $working_plan);
    }

    foreach ([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ] as $day_of_week) {
        if (!isset($working_plan[$day_of_week])) {
            $working_plan[$day_of_week] = null;
        }
    }

    $working_plan = array_reverse($working_plan);
    return json_encode($working_plan);
}

function provision(
    $payload,
    $db,
    $admins_model,
    $session,
    $settings_model,
    $services_model,
    $providers_model,
    $secretaries_model
) {
    $url_prefix = strtolower(str_replace('.', '',
        filter_var($payload['practice_name'], FILTER_SANITIZE_EMAIL)
    ));
    $db_prefix = sprintf('ea_%s_', str_replace('/([AZ09])/', '$1', $url_prefix));

    $company_url = sprintf('http://%s.%s', $url_prefix, $_SERVER['HTTP_HOST']);

    // Create E!A database structure.
    $file_contents = file_get_contents(dirname(BASEPATH) . '/assets/sql/structure.sql');
    // multi-user accounts
    $file_contents = str_replace('ea_', $db_prefix, $file_contents);

    $sql_queries = explode(';', $file_contents);
    array_pop($sql_queries);
    foreach ($sql_queries as $query) {
        $db->query($query);
    }

    // Insert default E!A entries into the database.
    $file_contents = file_get_contents(dirname(BASEPATH) . '/assets/sql/data.sql');
    // multi-user accounts
    $file_contents = str_replace('ea_', $db_prefix, $file_contents);
    $sql_queries = explode(';', $file_contents);
    array_pop($sql_queries);
    foreach ($sql_queries as $query) {
        $db->query($query);
    }

    // clean input: subdomain: no slashes, lowercase. URL accessible.
    $tenant_dir = FCPATH . 'tenants';
    $tenant_path = sprintf('%stenants/%s', FCPATH, $url_prefix);

    $to_copy = [
        FCPATH . '/tenants/config.php' => $tenant_path . '/config.php',
    ];

    // Prepare the tenants directory
    setup_dir($tenant_dir);
    setup_dir($tenant_path);

    foreach ($to_copy as $from => $to) {
        // Prepare the new tenant
        if (!copy($from, $to)) {
            break;
        }
    }

    $file = read_file($tenant_path . '/config.php');
    $file = str_replace('http://app', sprintf('http://%s', $url_prefix), $file);
    $file = str_replace("const DB_PREFIX = '';", "const DB_PREFIX = '$db_prefix';", $file);
    write_file($to, $file);

    $db->set_dbprefix($db_prefix);

    // Insert admin
    $admin['email'] = $payload['email'];
    $admin['first_name'] = $payload['first_name'];
    $admin['last_name'] = $payload['last_name'];
    $admin['phone_number'] = $payload['practice_phone'];
    $admin['address'] = $payload['practice_address_1'];
    $admin['state'] = $payload['practice_state'];
    $admin['zip_code'] = $payload['practice_zip'];
//            $admin['password'] = $payload['password'];
    $admin['settings']['username'] = $payload['email'];
    $admin['settings']['password'] = $payload['password'];
    $admin['settings']['calendar_view'] = CALENDAR_VIEW_DEFAULT;
    $admin['id'] = $admins_model->add($admin);

//            $session->set_userdata('db_prefix', $db_prefix);
    $session->set_userdata('user_id', $admin['id']);
    $session->set_userdata('user_email', $admin['email']);
    $session->set_userdata('role_slug', DB_SLUG_ADMIN);
    $session->set_userdata('username', $payload['email']);

    // Save company settings
    $settings_model->set_setting('company_name', $payload['practice_name']);
    $settings_model->set_setting('company_email', $admin['email']);
    $settings_model->set_setting('company_link', $company_url);

    if (isset($payload['hours']) && !empty($payload['hours'])) {
        $working_plan = get_working_plan($payload['hours']);
    } else {
        $working_plan = $settings_model->get_setting('company_working_plan');
    }

    $services = [];
    $doctors = [];
    $staff = [];

    // default service
    if (empty($payload['services'])) {
        $payload['services'] = [
            ['name' => 'Generic Service #1', 'duration' => 60, 'attendants_number' => 5],
            ['name' => 'Generic Service #2', 'duration' => 60, 'attendants_number' => 5],
        ];
    }

    foreach ($payload['services'] as $_service) {
        $services[] = $services_model->add(populate_service($_service));
    }

    // default doctor
    $doctor = populate_doctor([
        'first_name' => $payload['first_name'],
        'last_name' => $payload['last_name'],
        'phone_number' => $payload['practice_phone'],
        'email' => $payload['email'],
    ]);

    $admin_user = explode('@', $payload['email']);
    $doctor['settings']['username'] = sprintf('provider@%s', $admin_user[1]);
    $doctor['settings']['password'] = $payload['password'];
    $doctor['settings']['working_plan'] = $working_plan;

    $doctor['services'] = $services;
    $doctors[] = $providers_model->add($doctor);

    if (!empty($payload['invites'])) {
        foreach ($payload['invites'] as $_doctor) {
            // if ( 'doctor' != $_doctor['type'] ) {
            //     continue;
            // }
            if (!isset($_doctor['type']) || 'doctor' != $_doctor['type']) {
                continue;
            }

            $doctor = populate_doctor($_doctor);
            $doctor['services'] = $services;
            $doctor['working_plan'] = $working_plan;
            $doctors[] = $providers_model->add(populate_doctor($doctor));
        }

        foreach ($payload['invites'] as $_staff) {
            if (!isset($_staff['type']) || 'staff' != $_staff['type']) {
                continue;
            }

            $staff = populate_staff($_staff);
            $staff[] = $secretaries_model->add(populate_staff($staff));
        }
    }

    unset($services, $doctors, $staff);

    $settings_model->set_setting('company_working_plan', $working_plan);

    return $company_url;
}
