Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*"

    resource "/solaris_potiguar/*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options]

    resource "/api/*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options]

    resource "/health",
      headers: :any,
      methods: [:get]
  end
end
