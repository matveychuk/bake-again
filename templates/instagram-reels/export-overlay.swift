import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers

@main struct ExportOverlay {
 static func main() throws {
  let root=URL(fileURLWithPath:CommandLine.arguments[1]), out=URL(fileURLWithPath:CommandLine.arguments[2])
  let badge=try GlutenFreeBadge(configuration:root.appendingPathComponent("badge-horizontal-v1.json"))
  let fontURL=root.deletingLastPathComponent().appendingPathComponent("recipe-pdf/fonts/Manrope-Semibold.ttf")
  let desc=CTFontManagerCreateFontDescriptorsFromURL(fontURL as CFURL) as! [CTFontDescriptor]
  let font=CTFontCreateWithFontDescriptor(desc[0],badge.number("fontSize"),nil)
  let cs=CGColorSpace(name:CGColorSpace.sRGB)!
  func color(_ n:UInt32)->CGColor {CGColor(red:CGFloat((n>>16)&255)/255,green:CGFloat((n>>8)&255)/255,blue:CGFloat(n&255)/255,alpha:1)}
  for frame in 0..<60 {
   let c=CGContext(data:nil,width:1080,height:1920,bitsPerComponent:8,bytesPerRow:0,space:cs,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
   c.clear(CGRect(x:0,y:0,width:1080,height:1920))
   badge.draw(c,time:Double(frame)/30,animated:true,canvasHeight:1920,accent:color(0x853C29),cream:color(0xFAF6EF),font:font)
   let dest=CGImageDestinationCreateWithURL(out.appendingPathComponent(String(format:"stamp-%03d.png",frame)) as CFURL,UTType.png.identifier as CFString,1,nil)!
   CGImageDestinationAddImage(dest,c.makeImage()!,nil);precondition(CGImageDestinationFinalize(dest))
  }
  print("60 transparent PNG frames at 30fps exported")
 }
}
