**UI Framework built from ground up, powered by HTML5 Canvas.**

License: MIT    
Version: 0.0.0  
Status: Very early phase. Many of the following info can be obsolete and is subject to
change.

# Diagrams

![Architecture](https://github.com/marty-wang/OOPCanvas/raw/master/docs/architecture.jpg "Architecture")
![Runloop](https://github.com/marty-wang/OOPCanvas/raw/master/docs/sequence.jpg "Runloop")
![Interaction](https://github.com/marty-wang/OOPCanvas/raw/master/docs/interaction.jpg "Interaction")

# Coding Style

1. public methods: ClassName.prototype.publicMethod = function(args) {};
2. protected methods: ClassName.prototype.\_protectedMethod = function(args) {};
3. private methods: defined as function \_privateMethod () {} in Closure.

# Some ideas

1. core and main modules don't have to namespace their contributed public
   methods.
2. 3rd-party moduels and plugins MUST namespace their contributed public
   methods. 
   plugins are not first-class citizen, in terms that they can only bring in
   instance methods. 3rd-party module, however, has the full ability as the
   first-party module. e.g. create sub-namespace under OOPCanvas, and
   contribute the static class, properties and configurations. 

3. module can be defined as a function or an object. if module is defined
   a function, it will not have submodules. If module has submodules, it needs
   to be defined as an object, and each of its submodules can be either
   a function or object.


# TODO:

**Architecture**
**Performance**
It seems that hitTest adds quite a lot performace overhead.
