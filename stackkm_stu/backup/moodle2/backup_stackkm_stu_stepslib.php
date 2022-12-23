<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Backup steps for block_stackkm_stu are defined here.
 *
 * @package     block_stackkm_stu
 * @category    backup
 * @copyright   2022 WangLilin<Rin_Freyja@hotmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// More information about the backup process: {@link https://docs.moodle.org/dev/Backup_API}.
// More information about the restore process: {@link https://docs.moodle.org/dev/Restore_API}.

/**
 * Define the complete structure for backup, with file and id annotations.
 */
class backup_stackkm_stu_block_structure_step extends backup_block_structure_step {

    /**
     * Defines the structure of the resulting xml file.
     *
     * @return backup_nested_element The structure wrapped in the block tag.
     */
    protected function define_structure() {
        global $DB;

        // Replace with the attributes and final elements that the element will handle.
        $attributes = null;
        $finalelements = null;
        $root = new backup_nested_element('block_stackkm_stu', $attributes, $finalelements);

        // Build the tree with these elements with $root as the root of the backup tree.

        // Define the source tables for the elements.

        // Define id annotations.

        // Define file annotations.

        return $this->prepare_block_structure($root);
    }
}
