require 'rubygems'
require 'haml'
require "./lib/jammit"
require 'fileutils'

LANGS = ["en"]

namespace :assets do


  task :generate, [:lang] => [:clean, :jam, :copy] do
    puts "Generate resources"
  end

  desc 'Clean up assets'
  task :clean, [:lang] do
    puts "remove generated files....."
    (['gen', 'images']+ (1..3).to_a.map{|a| "stories/#{a}/audio/with_music.wav" }).each do |file_name|
      puts file_name
      FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end

  end

  desc 'Compress javascript'
  task :jam, [:lang] do | t, args |
    Jammit.package!(:config_path => File.join(File.dirname(__FILE__), "..", "config", "assets.yml"))
  end

  desc 'Copy files'
  task :copy, [:lang] do | t, args |
      lang = args[:lang]  || 'en'
      lang = "en" unless LANGS.include? lang

      puts "Selected language...#{lang}"

      #copy app images
    ['images'].each do |file_name|

      FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', file_name), File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end

      #copy selected lang audio
    ["2", "3"].each do |num|

      FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', "stories", num, "audio", "#{lang}.wav"), File.join(File.dirname(__FILE__), '..', 'assets', 'www',  "stories", num, "audio", "with_music.wav")
    end



  end

  task :env do
    puts "env"
  end
end
