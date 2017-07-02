//
//  TCJSONKit.h
//  TCJSONKit
//
//  Created by tauCross on 16/4/19.
//  Copyright © 2016年 tauCross. All rights reserved.
//

#import <Foundation/Foundation.h>



@interface TCJSONKit : NSObject

+ (NSString *)tc_stringWithArray:(NSArray *)array;
+ (NSString *)tc_stringWithDictionary:(NSDictionary *)dictionary;
+ (id)tc_objectWithString:(NSString *)string;

@end



@interface NSObject (TCJSONKit)

- (NSString *)tc_JSONString;

@end



@interface NSArray (TCJSONKit)

- (NSString *)tc_JSONString;

@end



@interface NSDictionary (TCJSONKit)

- (NSString *)tc_JSONString;

@end



@interface NSString (TCJSONKit)

- (id)tc_JSONObject;

@end
