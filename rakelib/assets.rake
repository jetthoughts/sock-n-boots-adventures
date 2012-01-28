require 'rubygems'
require 'haml'
require "./lib/jammit"
require 'fileutils'


namespace :assets do

  task :generate => [:clean, :jam, :copy] do
    puts "Generate resources"
  end

  desc 'Clean up assets'
  task :clean do
    puts "remove generated files....."
    ['gen', 'images'].each do |file_name|
      puts file_name
      FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end

  end

  desc 'Compress javascript'
  task :jam do | t, args |
  Jammit.package!(:config_path => File.join(File.dirname(__FILE__), "..", "config", "assets.yml"))

  end

  desc 'Copy files'
  task :copy do | t, args |
    ['images'].each do |file_name|
      puts file_name
      FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', file_name), File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end
  end

  task :env do
    puts "env"
  end
end
