require 'tools/lib/sprockets'

secretary = Sprockets::Secretary.new(
  :source_files => ["js/oc/*.js"]
)

concatenation = secretary.concatenation
concatenation.save_to("js/dist/oc.js")
