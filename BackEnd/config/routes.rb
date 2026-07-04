Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

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
  end
end
