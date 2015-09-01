#import "DRAWView.h"
#import "RCTConvert.h"
#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "PPSSignatureView.h"
#import "DRAWViewManager.h"
#import "GlobalDrawingState.h"

@implementation DRAWView {
  BOOL loaded;
  EAGLContext *context;
}

@synthesize signatureView;
@synthesize drawViewManager;

- (instancetype)init {
  if ((self = [super init])) {
  }

  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  if (!loaded) {
    context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];

		CGSize screen = self.bounds.size;

		self.signatureView = [[PPSSignatureView alloc]
																initWithFrame: CGRectMake(0, 0, screen.width, screen.height)
																context: context];
    
		[self addSubview:signatureView];
    GlobalDrawingState* globalDrawingState = [GlobalDrawingState getInstance];
    globalDrawingState.signatureView = signatureView;
  }
  loaded = true;
}

@end
