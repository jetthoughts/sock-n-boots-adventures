require 'rubygems'
require 'yaml'
require 'aws'
require 'nokogiri'

namespace :ios do
  desc 'List iOS sdks'
  task :sdks do
    puts `xcodebuild -showsdks`
  end

  desc 'Describe Workspace'
  task :info do
    puts `xcodebuild -list -workspace ios/SocknBoots.xcodeproj/project.xcworkspace`
  end

  desc 'Describe Info Plist'
  task :plist => :env do
   #
  puts File.join(@build_path, 'Info.plist')
   #puts `plutil -convert xml1 #{File.join(@build_path, 'Info.plist')}`
   puts `cat #{File.join(@build_path, 'Info.plist')}`
  end


  desc 'Increment Build Number'
  task :increment do
    build = 3 # Use Jenkins Build Number
    puts `cd ios && agvtool -noscm new-version -all #{build} && cd ..`
  end

  desc 'Set Identifier'
  task :set_ident, [:lang] => :env do | t, args |
    info_path = File.join(File.dirname(__FILE__), '..', 'ios', 'SocknBoots', 'SocknBoots-Info.plist')
    puts `/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier #{@bundle_identifier}" #{info_path}`
  end

  desc 'Insert Revision'
  task :update_version => :env do
    info_path = File.join(File.dirname(__FILE__), '..', 'ios', 'SocknBoots', 'SocknBoots-Info.plist')

    puts "Update bundle version: #{info_path} #{@bundle_version} #{@market_version} #{@revision}"
    puts `/usr/libexec/PlistBuddy -c "Set :CFBundleVersion #{@bundle_version}" #{info_path}`
    puts `/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString #{@market_version}" #{info_path}`
    puts `/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier #{@bundle_identifier}" #{info_path}`

  end

  desc 'Build'
  task :build => [:clean, :env] do
    target = 'Karaoke'
    puts `xcodebuild -project ios/SocknBoots.xcodeproj -target #{target} -configuration #{@config} -sdk #{@sdk} -verbose`
  end


  desc 'Clean Project Build'
  task :clean do
    puts "Clean project..."
    puts `xcodebuild -project ios/Karaoke.xcodeproj clean`
    # Delete old archives
    Dir["#{File.join(File.dirname(__FILE__), '..', 'dist')}/*.ipa"].each do |file|
      File.delete(file)
    end
  end

  desc 'Build IPA and Sign App'
  task :package => [:build] do
    puts "Task: Dist"
    certificate = CONFIG['certificate']
    mobile_provision = File.join(File.dirname(__FILE__), '..','config', 'Smith_Appstore.mobileprovision')

    puts `xcrun -sdk iphoneos PackageApplication #{@build_path} -o #{@ipa_path} --sign '#{certificate}' --embed #{mobile_provision}`

  end

  desc 'Verify App'
  task :verify => :env do
   `codesign -d -vvv --file-list - #{@build_path}`
  end


  task :env do | t, args |
    puts "!" * 100
    lang = args[:lang]  || 'en'
    ENV['profile'] = "adhoc" if ENV['profile'].nil?

    CONFIG = YAML.load_file(File.join(File.dirname(__FILE__), '..','config', 'config.yml'))[ENV['profile']]

    puts CONFIG.inspect
    @revision = `git log -1 --pretty=oneline --abbrev-commit | cut -c1-7`.strip
    @market_version = "1.0-alpha"
    @bundle_identifier = "com.jetthoughts.SocknBoots-#{lang.upcase}"
    @bundle_version = IO.read(File.join(File.dirname(__FILE__), '..', 'VERSION')).strip


    puts ENV['BUILD_NUMBER']
    if ENV['BUILD_NUMBER'].nil?
      @build_nr = 'xx'
    else
      @build_nr = ENV['BUILD_NUMBER']
    end
    @ipa_name = "SocknBoots-#{@bundle_version}-b#{@build_nr}.ipa"
    @ipa_path = File.join(File.dirname(__FILE__), '..','dist', @ipa_name)
    @manifest_name = "SocknBoots-#{@bundle_version}-b#{@build_nr}.plist"

    puts "Build: #{@build_nr}"
    puts "Ipa name: #{@ipa_name}"
    configs = { :debug => 'Debug', :release => 'Release' }
    @config = configs[:release]
    sdks = { :simlutator => 'iphonesimulator4.3', :os => CONFIG['sdk'] }

    @sdk = sdks[:os]
    build_dir =  File.join(File.dirname(__FILE__), '..', 'ios', 'build', "#{@config}-#{(@sdk.include? 'simulator')? 'iphonesimulator' : 'iphoneos' }")
    @build_path = File.join(build_dir, 'SocknBoots.app')

  end

end



def upload_ota(str, path)
  s3 = Aws::S3Interface.new(CONFIG['aws']['key'], CONFIG['aws']['secret'])
  bucket = "dw.musicdelta.com"
  headers = { "x-amz-acl" =>  "public-read", 'content-type' => 'text/xml'}
  s3.put(bucket, path,  str, headers)
end

def build_ota(app_url, fullsize_image_url, display_image_url, bundle_identifier, bundle_version, title, subtitle)
  # .plist - text/xml
  # .ipa - application/octet-stream
  builder = Nokogiri::XML::Builder.new do
doc.create_internal_subset(
  'plist',
  "-//Apple//DTD PLIST 1.0//EN",
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd")
    plist(:version => '1.0') {
      dict {
        key "items"
        array {
          dict {
            key "assets"
            array {
              dict {
                key "kind"
                string "software-package"
                key "url"
                string app_url
              }
              dict {
                key "kind"
                string "full-size-image"
                key "needs-shine"
                send(:true)
                key "url"
                string fullsize_image_url
              }
              dict {
                key "kind"
                string "display-image"
                key "needs-shine"
                send(:true)
                key "url"
                string display_image_url
              }
            }
            key "metadata"
            dict {
              key "bundle-identifier"
              string bundle_identifier
              key "bundle-version"
              string bundle_version
              key "kind"
              string "software"
              key "subtitle"
              string subtitle
              key "title"
              string title
            }
          }
        }
      }
    }
  end
end