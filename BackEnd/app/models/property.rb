class Property < ApplicationRecord
  has_many :analyses, dependent: :destroy

  validates :location, presence: true
  validates :installed_capacity_kwp, presence: true, numericality: { greater_than: 0 }
  validates :average_daily_consumption_kwh, presence: true, numericality: { greater_than: 0 }

  validates :battery_capacity_kwh, numericality: { greater_than: 0 }, if: :has_battery?

  geocoded_by :location, latitude: :latitude, longitude: :longitude
  after_validation :geocode, if: -> { location.present? && (latitude.blank? || longitude.blank?) }

  def battery_capacity_kwh
    has_battery? ? self[:battery_capacity_kwh] : 0
  end
end
