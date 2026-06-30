class CreateAnalyses < ActiveRecord::Migration[7.1]
  def change
    create_table :analyses do |t|
      t.references :property, null: false, foreign_key: true
      t.datetime :analysis_date, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.decimal :solar_irradiation, precision: 10, scale: 2
      t.decimal :cloud_cover, precision: 5, scale: 2
      t.decimal :temperature, precision: 5, scale: 2

      t.decimal :estimated_generation_kwh, precision: 10, scale: 3
      t.decimal :estimated_consumption_kwh, precision: 10, scale: 3
      t.decimal :balance_kwh, precision: 10, scale: 3
      t.string :classification

      t.decimal :battery_charge_kwh, precision: 10, scale: 3
      t.string :battery_status

      t.text :executive_summary
      t.text :recommendations
      t.decimal :estimated_savings_kwh, precision: 10, scale: 3
      t.decimal :estimated_savings_currency, precision: 12, scale: 2
      t.string :currency, default: "BRL"
      t.jsonb :raw_data, default: {}

      t.timestamps
    end
  end
end
