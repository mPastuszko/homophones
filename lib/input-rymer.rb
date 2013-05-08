require 'uri'
require 'net/http'
require 'nokogiri'

module Input
  module Rymer
    SiteURI = URI.parse('http://www.rymer.org/rymer/szuX.php')
    DefaultParams = {
      'zakladka' => '1',
      'pagg' => '354',
      'slownik' => 'R',
      'minsyl' => '1',
      'maxsyl' => '5',
      'czemow' => 'A'
    }


    def self.lookup(word)
      params = DefaultParams.merge('Wyraz' => word)
      response = Net::HTTP.post_form(SiteURI, params)
      extract_homophones(response.body)
    end

    private

    def self.extract_homophones(html)
      doc = Nokogiri::HTML(html)
      homophones = []
      doc.css('.tball').each do |group|
        style = group.css('.tbgorarym').text.scan(/w stylu '(.+)'/).flatten.first
        power = group.css('.tbgoramoc span b').text.scan(/\d+%/).first
        words = group.css('.tbdol div') \
          .xpath('child::text()') \
          .map(&:text) \
          .reject { |word_set| word_set =~ /^\s*:\s*$/ }
          .map { |word_set| word_set.split(/\s*,\s*/) } \
          .flatten \
          .sort
        words.each { |word| homophones << {style: style, power: power, word: word} }
      end
      homophones
    end
  end
end
