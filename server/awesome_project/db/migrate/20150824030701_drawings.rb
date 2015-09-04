class Drawings < ActiveRecord::Migration
  def change
    create_table :drawings do |t|
      t.attachment :image
      t.timestamps
    end
  end
end
