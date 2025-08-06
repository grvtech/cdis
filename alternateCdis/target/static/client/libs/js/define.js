import * as nav from './navigation.js'

export let page = nav.getPage();
export let applanguage="en";
export let userObj = null;
export let userProfileObj = null;
export let sid = nav.getParameterByName("sid");
export let $body = $("body");
export let containerApp = $('#grvWraper');
export let isDemo=false;
export let progressOn=false;



 