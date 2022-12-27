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
 * Block stackkm_stu is defined here.
 *
 * @package     block_stackkm_stu
 * @copyright   2022 WangLilin<Rin_Freyja@hotmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_stackkm_stu extends block_base {

    /**
     * Initializes class member variables.
     */
    public function init() {
        // Needed by Moodle to differentiate between blocks.
        $this->title = get_string('pluginname', 'block_stackkm_stu');
    }

    /**
     * Returns the block contents.
     *
     * @return stdClass The block contents.
     */
    public function get_content() {

        global  $DB;

        if ($this->content !== null) {
            return $this->content;
        }

        if (empty($this->instance)) {
            $this->content = '';
            return $this->content;
        }

        $this->content = new stdClass();
        $this->content->items = array();
        $this->content->icons = array();
        $this->content->footer = '';

        $url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $knowledgeMapUrl = new moodle_url('/blocks/stackkm_stu/knowledgeMap.html');
        $course = $this->page->course;

        if (!$DB->record_exists('stackkm_km',array('courseid'=>$course->id))){
            $this->content->text = "NO MAP FOR THIS COURSE";
        }
        else{
            $iconic = new moodle_url('/blocks/stackkm_stu/icon/graph_icon.png');
            $this->content->text = '<form action="'.$knowledgeMapUrl.'?id='.$course->id.'&url='.$url.'" name="jump" method="POST" id="infoForm">';
            $this->content->text .= '<label>View Knowledge Map here.</label>';
            $this->content->text .= '<input type="image" src="'.$iconic.'" style="width:180px;height:135px">';
            $this->content->text .= '</form>';
        }

        return $this->content;
    }

    /**
     * Defines configuration data.
     *
     * The function is called immediately after init().
     */
    public function specialization() {

        // Load user defined title and make sure it's never empty.
        if (empty($this->config->title)) {
            $this->title = get_string('pluginname', 'block_stackkm_stu');
        } else {
            $this->title = $this->config->title;
        }
    }

    /**
     * Sets the applicable formats for the block.
     *
     * @return string[] Array of pages and permissions.
     */
}
