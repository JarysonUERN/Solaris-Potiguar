class Analysis < ApplicationRecord
  belongs_to :property

  validates :analysis_date, presence: true

  scope :ordered, -> { order(analysis_date: :desc) }
  scope :recent, ->(limit = 10) { ordered.limit(limit) }
end
