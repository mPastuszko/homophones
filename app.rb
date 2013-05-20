# encoding: UTF-8

require 'sinatra'
require 'slim'
require 'json'
require_relative 'lib/input-rymer'
require_relative 'lib/addition-freq_dict'

configure do
  set :dict, Addition::FreqDict.new('data/freq-dict.pl.bin')
end

configure :test do
  disable :logging
end

get '/' do
  slim :home
end

get '/results.json' do
  logger.info "Looking for homophones for word \"#{params[:word]}\""
  content_type :json
  homophones(params[:word]).to_json
end

get '/*' do
  @word = params[:splat].first
  slim :homophones
end

post '/' do
  redirect to('/' + params[:word])
end

def homophones(word)
  homophones = Input::Rymer::lookup(word)
  settings.dict.enrich!(homophones)
end