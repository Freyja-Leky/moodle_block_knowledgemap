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
 * Block devesample is defined here.
 *
 * @package     block_devesample
 * @copyright   2022 WangLilin<Rin_Freyja@hotmail.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_devesample extends block_base {

    /**
     * Initializes class member variables.
     */
    public function init() {
        // Needed by Moodle to differentiate between blocks.
        $this->title = get_string('pluginname', 'block_devesample');
    }

    /**
     * Returns the block contents.
     *
     * @return stdClass The block contents.
     */
    public function get_content() {
        global $CFG, $DB;

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

        $knowledgeMapPageurl = new moodle_url('/blocks/devesample/knowledgeMap.html');
        $course = $this->page->course;

        if (!$DB->get_record('block_devesample_km',array('courseid'=>$course->id))){
            $this->content->text = '<a href="'.$knowledgeMapPageurl.'">New Knowledge Map for this course here.</a>';
        }
        else{
            $url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

            $questionPageurl = new moodle_url('/blocks/devesample/question.html');
            $iconic = new moodle_url('/blocks/devesample/icon/graph_icon.png');
//            $url = new moodle_url('/blocks/devesample/test.html');
            $this->content->text = '<form action="'.$knowledgeMapPageurl.'" name="jump" method="POST" id="infoForm">';
            $this->content->text .= '<label>Modify KnowLedge Map for this course.</label>';
            $this->content->text .= '<input type="image" src="'.$iconic.'" style="width:180px;height:135px">';
            $this->content->text .= '<input type="hidden" name="url" value="'.$url.'">';
            $this->content->text .= '<input type="hidden" name="courseID" value="'.$course->id.'">';
            $this->content->text .= '<input type="hidden" name="courseShortName" value="'.$course->shortname.'">';
            $this->content->text .= '<input type="hidden" name="courseFullName" value="'.$course->fullname.'">';
            $this->content->text .= '</form>';

            $this->content->text .='<a href="'.$questionPageurl.'?id='.$course->id.'&url='.$url.'">Edit Question Feedback Here</a>';
//        $this->content->text .='<a href="'.$url.'?id='.$course->id.'&url='.$url.'">Edit TEST Feedback Here</a>';
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
            $this->title = get_string('pluginname', 'block_devesample');
        } else {
            $this->title = $this->config->title;
        }
    }

    /**
     * Sets the applicable formats for the block.
     *
     * @return string[] Array of pages and permissions.
     */
//    public function applicable_formats() {
//        return array(
//        );
//    }
}

