class AlignPropertyFieldsWithFrontend < ActiveRecord::Migration[7.1]
  def change
    rename_column :properties, :location, :city
    rename_column :properties, :installed_capacity_kwp, :installed_power_kwp
    rename_column :properties, :business_type, :operation_type

    add_column :properties, :farm_name, :string
    add_column :properties, :peak_consumption_period, :string
    add_column :properties, :flexible_operation, :boolean, default: false
    add_column :properties, :main_equipments, :jsonb, default: []
    add_column :properties, :operation_description, :text
  end
end
