#import <Foundation/Foundation.h>
#import "PPSSignatureView.h"

@interface GlobalDrawingState : NSObject {
  NSString* base64EncodedDrawing;
}

@property(nonatomic,retain)PPSSignatureView *signatureView;

+(GlobalDrawingState*)getInstance;
@end
