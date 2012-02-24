require 'rubygems'
require 'haml'
require "./lib/jammit"
require 'fileutils'

LANGS = %w(en es)

namespace :assets do


  task :generate, [:lang] => [:clean, :jam, :copy] do | t, args |
    puts "Generate resources"
    lang = args[:lang]  || 'en'
    Rake::Task["ios:set_ident"].invoke(lang)
  end

  desc 'Clean up assets'
  task :clean, [:lang] do
    puts "remove generated files....."
    files_to_remove = (['gen', 'images'] +
        (1..3).to_a.map{|i| "stories/#{i}/with_music.wav" } +
        (1..3).to_a.map{|i| ["cover_thumb.jpg","cover.jpg"].map{|name| ["iphone", "ipad"].map {|pl|   "stories/#{i}/images/#{pl}/#{name}" }  } }.flatten <<
        "stories/main_menu_bg.jpg"
     )

    files_to_remove.each do |file_name|
      FileUtils.rm_rf File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
    end

  end

  desc 'Compress javascript'
  task :jam, [:lang] do | t, args |
    lang = args[:lang]  || 'en'
    lang = "en" unless LANGS.include? lang

    Jammit.package!(:config_path => File.join(File.dirname(__FILE__), "..", "config", "assets.#{lang}.yml"))
  end

  desc 'Copy files'
  task :copy, [:lang] do | t, args |
      lang = args[:lang]  || 'en'
      lang = "en" unless LANGS.include? lang
      puts "Selected language...#{lang}"

      #copy app images
    ['images/low', 'images/middle', 'images/high'].each do |file_name|
      dir_path = File.join(File.dirname(__FILE__), '..', 'assets', 'www', file_name)
      FileUtils.mkdir_p dir_path unless File.exists?(dir_path)

      FileUtils.cp_r  Dir.glob(File.join(File.dirname(__FILE__), '..', 'assets_src', file_name,"*.*")), dir_path
      FileUtils.cp_r  Dir.glob(File.join(File.dirname(__FILE__), '..', 'assets_src', file_name,lang, "*.*")), dir_path
    end

      #copy selected lang audio
    ["1", "2", "3"].each do |num|
      FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', "stories", num, "audio", "#{lang}.wav"), File.join(File.dirname(__FILE__), '..', 'assets', 'www',  "stories", num, "with_music.wav")
    end

    ["1", "2", "3"].each do |num|
      ["iphone", "ipad"].each do |pl|
        ["cover_thumb.jpg","cover.jpg"].each do |name|
          lang_name =  name.sub(".", ".#{lang}.")
          FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', "stories", num, "images", pl, lang_name ), File.join(File.dirname(__FILE__), '..', 'assets', 'www',  "stories", num, "images", pl, name)
        end
      end

    end

    #copy main menu cover
    name = "main_menu_bg.jpg"
    lang_name =  name.sub(".", ".#{lang}.")
    FileUtils.cp_r File.join(File.dirname(__FILE__), '..', 'assets_src', "stories", lang_name ), File.join(File.dirname(__FILE__), '..', 'assets', 'www',  "stories", name)




  end

  task :env do
    puts "env"
  end
end
