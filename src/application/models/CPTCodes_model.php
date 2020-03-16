<?php defined('BASEPATH') OR exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2018, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.3.2
 * ---------------------------------------------------------------------------- */

/**
 * Class CPTCodes_model
 *
 * @package Models
 */
class CPTCodes_model extends CI_Model {
    /**
     * Add a billing record to the database.
     *
     * This method adds a consent to the database.
     *
     * @param array $cpt Associative array with the billing's data.
     *
     * @return int Returns the consent ID.
     */
    public function add($cpt)
    {
        $this->validate($cpt);

        if ( ! isset($cpt['id']))
        {
            $cpt['id'] = $this->_insert($cpt);
        }
        else
        {
            $this->_update($cpt);
        }

        return $cpt['id'];
    }


    /**
     * Validate billing data before the insert or update operation is executed.
     *
     * @param array $cpt Contains the billing data.
     *
     * @throws Exception If customer validation fails.
     */
    public function validate($cpt)
    {
        if ( ! isset($cpt['code'])
            || ! isset($cpt['price']))
        {
            throw new Exception('Not all required fields are provided: '
                . print_r($cpt, TRUE));
        }
    }

    /**
     * Insert a new billing record to the database.
     *
     * @param array $cpt Associative array with the consent's data.
     *
     * @return int Returns the ID of the new record.
     *
     * @throws Exception If consent record could not be inserted.
     */
    protected function _insert($cpt)
    {
        if ( ! $this->db->insert('cpt_codes', $cpt))
        {
            throw new Exception('Could not insert CPT code to the database.');
        }

        return (int)$this->db->insert_id();
    }

    /**
     * Update an existing billing record in the database.
     *
     * The consent data argument should already include the record ID in order to process the update operation.
     *
     * @param array $cpt Associative array with the consent's data.
     *
     * @return int Returns the updated record ID.
     *
     * @throws Exception If consent record could not be updated.
     */
    protected function _update($cpt)
    {
        if ( ! $this->db->update('cpt_codes', $cpt, ['id' => $cpt['id']]))
        {
            throw new Exception('Could not update CPT code to the database.');
        }

        return (int) $cpt['id'];
    }
}
