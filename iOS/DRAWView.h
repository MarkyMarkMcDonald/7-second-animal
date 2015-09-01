#import "PPSSignatureView.h"
#import <UIKit/UIKit.h>
#import "RCTView.h"
#import "RCTBridge.h"

@class DRAWViewManager;

@interface DRAWView : RCTView
@property (nonatomic, strong) PPSSignatureView *signatureView;
@property (nonatomic, strong) DRAWViewManager *drawViewManager;
@end
