# encoding: UTF-8

require 'sinatra'
require 'slim'
# require 'coffee_script'
require 'rack-flash'
require 'json'
require_relative 'lib/input-rymer'
require_relative 'lib/addition-freq_dict'

configure do
  enable :logging
  enable :sessions
  set :session_secret, 'homofony.secret'
  use Rack::Flash
  mime_type :ttf, 'font/ttf'
  mime_type :otf, 'font/otf'
  set :dict, Addition::FreqDict.new('data/freq-dict.pl.bin')
end

configure :test do
  disable :logging
end

get '/' do
  slim :home
end

get '/results.json' do
  content_type :json
  homophones(params[:word]).to_json
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
  homophones = Input::Rymer::lookup(word)
  settings.dict.enrich!(homophones)
end