class DrawingsController < ApplicationController

  skip_before_filter :verify_authenticity_token

  before_filter :cors_preflight_check
  after_filter :cors_set_access_control_headers

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
    headers['Access-Control-Max-Age'] = "1728000"
  end

  def cors_preflight_check
    if request.method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version, Token'
      headers['Access-Control-Max-Age'] = '1728000'

      render :text => '', :content_type => 'text/plain'
    end
  end

  def create
    Drawing.create(image: parse_base64_image(params[:image]), prompt: params[:prompt])
    render json: {}
  end

  def index
    prompt = params[:prompt]
    render json: {
             drawing_urls: Drawing.where(prompt: prompt).order(image_updated_at: :desc).limit(10).map(&:image_url)
           }
  end

  private
  def parse_base64_image(encoded)
    image = StringIO.new(Base64.decode64(encoded))
    image.class.class_eval { attr_accessor :original_filename, :content_type }
    image.original_filename = 'drawing.png'
    image.content_type = 'image/png'
    image
  end

end
