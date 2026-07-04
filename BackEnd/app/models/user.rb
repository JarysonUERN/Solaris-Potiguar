class User < ApplicationRecord
  has_secure_password

  has_many :properties, dependent: :destroy

  validates :full_name, presence: true
  validates :email, presence: true, uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :cpf, uniqueness: true, allow_blank: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end
