Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :solaris_potiguar do
    post "login",    to: "auth#login"
    post "register", to: "auth#register"

    get  "user",     to: "users#show"
    put  "user",     to: "users#update"

    post "onboarding", to: "onboarding#create"
  end

  namespace :api do
    resources :setup, only: [:create, :show, :update], controller: "setup", param: :id

    resources :climate, only: [] do
      collection do
        get "fetch/:property_id", to: "climate#fetch", as: :fetch
      end
    end

    resources :analysis, only: [:create, :show, :index], controller: "analysis", param: :id do
      collection do
        get "property/:property_id", to: "analysis#index", as: :by_property
      end
    end

    post "daily/send_reports", to: "daily_analysis#send_reports"
  end
end
