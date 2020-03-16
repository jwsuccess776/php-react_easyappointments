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
 * Class Services_Meta_model
 *
 * @package Models
 */
class Services_Meta_model extends CI_Model {
    /**
     * Add a patient record to the database.
     *
     * This method adds a consent to the database.
     *
     * @param array $record Associative array with the patient's data.
     *
     * @return int Returns the consent ID.
     */
    public function add($record)
    {
        $this->validate($record);

        if ( ! isset($record['id']))
        {
            $record['id'] = $this->_insert($record);
        }
        else
        {
            $this->_update($record);
        }

        return $record['id'];
    }


    /**
     * Validate patient data before the insert or update operation is executed.
     *
     * @param array $record Contains the patient data.
     *
     * @throws Exception If customer validation fails.
     */
    public function validate($record)
    {
        if ( ! isset($record['code'])
            || ! isset($record['price']))
        {
            throw new Exception('Not all required fields are provided: '
                . print_r($record, TRUE));
        }
    }

    /**
     * Insert a new patient record to the database.
     *
     * @param array $record Associative array with the consent's data.
     *
     * @return int Returns the ID of the new record.
     *
     * @throws Exception If consent record could not be inserted.
     */
    protected function _insert($record)
    {
        if ( ! $this->db->insert('service_meta', $record))
        {
            throw new Exception('Could not insert service meta to the database.');
        }

        return (int)$this->db->insert_id();
    }

    /**
     * Update an existing patient record in the database.
     *
     * The consent data argument should already include the record ID in order to process the update operation.
     *
     * @param array $record Associative array with the consent's data.
     *
     * @return int Returns the updated record ID.
     *
     * @throws Exception If consent record could not be updated.
     */
    protected function _update($record)
    {
        if ( ! $this->db->update('patient_records', $record, ['id' => $record['id']]))
        {
            throw new Exception('Could not update patient record to the database.');
        }

        return (int) $record['id'];
    }

    /**
     * Get all, or specific records from service's table.
     *
     * @example $this->Model->getBatch('id = ' . $recordId);
     *
     * @param string $whereClause (OPTIONAL) The WHERE clause of
     * the query to be executed. DO NOT INCLUDE 'WHERE' KEYWORD.
     *
     * @return array Returns the rows from the database.
     */
    public function get_batch($where_clause = NULL)
    {
        if ($where_clause != NULL)
        {
            $this->db->where($where_clause);
        }

        return $this->db->get('service_meta')->result_array();
    }
}
