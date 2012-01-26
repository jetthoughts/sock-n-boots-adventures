require 'rubygems'
require 'haml'
require 'jammit'
require 'fileutils'


namespace :assets do

  task :generate, [:platform] => [:clean, :jam] do
    puts "Generate resources"
  end

  desc 'Clean up assets'
  task :clean do
    puts "remove generated files....."
    ['gen'].each do |file_name|
      puts file_name
      FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end

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
