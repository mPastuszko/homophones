module Addition
  class FreqDict
    def initialize(source)
      file = source.is_a?(IO) ? source : File.open(source)
      @dict = Marshal.load(file)
    ensure
      file.close
    end

    def enrich!(collection)
      collection.map! do |e|
        e.merge!(frequency: @dict[e[:word]])
      end
    end

    def enrich(collection)
      collection.map do |e|
        e.merge!(frequency: @dict[e[:word]])
      end
    end
  end
end