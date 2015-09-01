#import "DRAWViewManager.h"
#import "GlobalDrawingState.h"

@implementation DRAWViewManager {
}

@synthesize drawView;

RCT_EXPORT_MODULE()

- (UIView *)view
{
  self.drawView = [[DRAWView alloc] init];
  self.drawView.drawViewManager = self;
  return drawView;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(imageAsBase64Encoded:(RCTResponseSenderBlock)callback) {
  GlobalDrawingState* globalDrawingState = [GlobalDrawingState getInstance];
  UIImage *signImage = [globalDrawingState.signatureView signatureImage];
  NSData *imageData = UIImagePNGRepresentation(signImage);
  NSString *base64Encoded = [imageData base64EncodedStringWithOptions:0];
  callback(@[[NSNull null], base64Encoded]);
}

@end
