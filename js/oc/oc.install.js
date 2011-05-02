// This file must be loaded after all modules files
// otherwise, all the modules afterwards will have to be install manually.
// This will happen to 3rd party module

//= require "oc.bootstrapper"
//= require "oc.core"
// and all 1st-party modules

OOPCanvas.installModules();

// TODO: allow for custom installation of modules
