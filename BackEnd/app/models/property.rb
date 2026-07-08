class Property < ApplicationRecord
  belongs_to :user
  has_many :analyses, dependent: :destroy

  validates :farm_name, presence: true
  validates :city, presence: true
  validates :installed_power_kwp, presence: true, numericality: { greater_than: 0 }
  validates :average_daily_consumption_kwh, presence: true, numericality: { greater_than: 0 }

  validates :battery_capacity_kwh, numericality: { greater_than: 0 }, if: :has_battery?

  geocoded_by :city, latitude: :latitude, longitude: :longitude
  after_validation :geocode, if: -> { city.present? && (latitude.blank? || longitude.blank?) }

  def battery_capacity_kwh
    has_battery? ? self[:battery_capacity_kwh] : 0
  end

  OPERATION_TYPES = %w[irrigacao avicultura comercio residencial agroindustria other].freeze
  PEAK_PERIODS = %w[morning afternoon night].freeze

  validates :operation_type, inclusion: { in: OPERATION_TYPES }, allow_blank: true
  validates :peak_consumption_period, inclusion: { in: PEAK_PERIODS }, allow_blank: true
end
