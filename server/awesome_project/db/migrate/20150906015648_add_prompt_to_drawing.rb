class AddPromptToDrawing < ActiveRecord::Migration
  def change
    add_column :drawings, :prompt, :string
  end
end
