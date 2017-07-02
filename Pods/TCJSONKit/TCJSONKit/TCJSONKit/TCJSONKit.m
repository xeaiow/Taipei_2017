//
//  TCJSONKit.m
//  TCJSONKit
//
//  Created by tauCross on 16/4/19.
//  Copyright © 2016年 tauCross. All rights reserved.
//

#import "TCJSONKit.h"



@implementation TCJSONKit

+ (NSString *)tc_stringWithArray:(NSArray *)array
{
    if([NSJSONSerialization isValidJSONObject:array])
    {
        NSError *error = nil;
        NSData *data = [NSJSONSerialization dataWithJSONObject:array options:0 error:&error];
        if(!error)
        {
            return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        }
    }
    return nil;
}

+ (NSString *)tc_stringWithDictionary:(NSDictionary *)dictionary
{
    if([NSJSONSerialization isValidJSONObject:dictionary])
    {
        NSError *error = nil;
        NSData *data = [NSJSONSerialization dataWithJSONObject:dictionary options:0 error:&error];
        if(!error)
        {
            return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        }
    }
    return nil;
}

+ (id)tc_objectWithString:(NSString *)string
{
    NSError *error = nil;
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    id object = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&error];
    if(!error)
    {
        return object;
    }
    return nil;
}

@end



@implementation NSDictionary (TCJSONKit)

- (NSString *)tc_JSONString
{
    return [TCJSONKit tc_stringWithDictionary:self];
}

@end



@implementation NSObject (TCJSONKit)

- (NSString *)tc_JSONString
{
    if([self isKindOfClass:[NSArray class]])
    {
        return [TCJSONKit tc_stringWithArray:(NSArray *)self];
    }
    else if([self isKindOfClass:[NSDictionary class]])
    {
        return [TCJSONKit tc_stringWithDictionary:(NSDictionary *)self];
    }
    else if([self isKindOfClass:[NSString class]])
    {
        return (NSString *)self;
    }
    else
    {
        return nil;
    }
}

@end



@implementation NSArray (TCJSONKit)

- (NSString *)tc_JSONString
{
    return [TCJSONKit tc_stringWithArray:self];
}

@end



@implementation NSString (TCJSONKit)

- (id)tc_JSONObject
{
    return [TCJSONKit tc_objectWithString:self];
}

@end
