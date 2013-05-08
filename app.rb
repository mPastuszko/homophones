# encoding: UTF-8

require 'sinatra'
require 'slim'
require 'coffee_script'
require 'rack-flash'
require 'json'
require_relative 'lib/input-rymer'

configure do
  enable :logging
  enable :sessions
  set :session_secret, 'homofony.secret'
  use Rack::Flash
  mime_type :ttf, 'font/ttf'
  mime_type :otf, 'font/otf'
end

configure :test do
  disable :logging
end

get '/' do
  slim :home
end

get '/*' do
  @word = params[:splat].first
  @homophones = homophones(@word)
  slim :homophones
end

post '/' do
  redirect to('/' + params[:word])
end

def homophones(word)
  Input::Rymer::lookup(word)
end