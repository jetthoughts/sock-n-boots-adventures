require 'rubygems'
require 'haml'
require 'jammit'
require 'fileutils'


namespace :assets do
  desc 'Clean up assets'
  task :clean do
    puts "remove generated files....."
    ['javascripts', 'css', 'images'].each do |folder_name|
      puts folder_name
      FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', folder_name)
    end
    FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', 'index.html')

  end

  desc 'Compress javascript'
  task :jam, [:platform] do | t, args |
    platform = args[:platform]
  Jammit.package!(:config_path => File.join(File.dirname(__FILE__), "..", "config", "assets-#{platform}.yml"))

  end

  task :env do
    puts "env"
  end
end
