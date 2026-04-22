#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (YTDLPModule, NSObject)

RCT_EXTERN_METHOD(search : (NSString *)query limit : (NSInteger)
                      limit resolver : (RCTPromiseResolveBlock)
                          resolve rejecter : (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getStreamUrl : (NSString *)videoId resolver : (
    RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getInfo : (NSString *)videoId resolver : (
    RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isAvailable : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

@end