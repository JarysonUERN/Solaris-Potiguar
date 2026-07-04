class CreateProperties < ActiveRecord::Migration[7.1]
  def change
    create_table :properties do |t|
      t.string :location, null: false
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.decimal :installed_capacity_kwp, precision: 10, scale: 3, null: false
      t.boolean :has_battery, default: false, null: false
      t.decimal :battery_capacity_kwh, precision: 10, scale: 3
      t.decimal :average_daily_consumption_kwh, precision: 10, scale: 3, null: false
      t.string :business_type

      t.timestamps
    end
  end
end
