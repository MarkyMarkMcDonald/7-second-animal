#import "GlobalDrawingState.h"

@implementation GlobalDrawingState

@synthesize signatureView;

static GlobalDrawingState *instance = nil;

+(GlobalDrawingState *)getInstance
{
  @synchronized(self)
  {
    if(instance==nil)
    {
      instance= [GlobalDrawingState new];
    }
  }
  return instance;
}

@end
