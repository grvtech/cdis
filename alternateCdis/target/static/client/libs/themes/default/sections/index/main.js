import * as ilib from './lib.js'; //ilib = index lib
import * as applib from './../../../../js/applib.js';
import sectionconfig from './config.json' with { type: 'json' };

/*
 * MAIN SECTION
 * */
applib.loadRessources(sectionconfig,ilib.initPage);

