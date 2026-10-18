import Foundation
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers
let root=URL(fileURLWithPath:CommandLine.arguments[1])
let configURL=root.appendingPathComponent(CommandLine.arguments[2]), output=root.appendingPathComponent(CommandLine.arguments[3])
let post=try JSONSerialization.jsonObject(with:Data(contentsOf:configURL)) as! [String:Any]
let layout=try JSONSerialization.jsonObject(with:Data(contentsOf:root.appendingPathComponent(post["layout"] as! String))) as! [String:Any]
let W=1080,H=1920,cs=CGColorSpace(name:CGColorSpace.sRGB)!
let tokenText=try String(contentsOf:root.appendingPathComponent("design-system/tokens.css"),encoding:.utf8)
func color(_ token:String)->CGColor {
 let pattern="--"+token+":\\s*(#[0-9a-fA-F]{6})",re=try! NSRegularExpression(pattern:pattern),range=NSRange(tokenText.startIndex...,in:tokenText)
 let match=re.firstMatch(in:tokenText,range:range)!,hex=String(tokenText[Range(match.range(at:1),in:tokenText)!]),n=UInt32(hex.dropFirst(),radix:16)!
 return CGColor(red:CGFloat((n>>16)&255)/255,green:CGFloat((n>>8)&255)/255,blue:CGFloat(n&255)/255,alpha:1)
}
let cream=color("color-background-page"),accent=color("color-action-primary"),strong=color("color-action-primary-strong"),white=color("color-text-on-accent")
var fonts=[String:String]()
for (role,file) in [("title","Literata-Semibold.ttf"),("body","Manrope-Semibold.ttf"),("label","Manrope-LabelBold.ttf"),("brand","Newsreader-Semibold.ttf")] {
 let url=root.appendingPathComponent("templates/recipe-pdf/fonts/"+file);CTFontManagerRegisterFontsForURL(url as CFURL,.process,nil)
 let ds=CTFontManagerCreateFontDescriptorsFromURL(url as CFURL) as! [CTFontDescriptor];fonts[role]=CTFontDescriptorCopyAttribute(ds[0],kCTFontNameAttribute) as? String
}
func cg(_ key:String,_ d:[String:Any])->CGFloat {CGFloat((d[key] as! NSNumber).doubleValue)}
func rect(_ x:CGFloat,_ top:CGFloat,_ width:CGFloat,_ height:CGFloat)->CGRect {CGRect(x:x,y:CGFloat(H)-top-height,width:width,height:height)}
func load(_ path:String)->CGImage {CGImageSourceCreateImageAtIndex(CGImageSourceCreateWithURL(root.appendingPathComponent(path) as CFURL,nil)!,0,nil)!}
var textBounds=[[String:Any]]()
func text(_ c:CGContext,_ string:String,_ box:[String:Any],_ role:String) {
 let size=cg("fontSize",box),font=CTFontCreateWithName(fonts[role]! as CFString,size,nil),x=cg("x",box),top=cg("top",box),width=(box["width"] as? NSNumber)?.doubleValue ?? 952,leading=(box["leading"] as? NSNumber)?.doubleValue ?? Double(size*1.25)
 c.textMatrix = .identity
 for (i,s) in string.split(separator:"\n").enumerated() {
  let a=NSAttributedString(string:String(s),attributes:[NSAttributedString.Key(kCTFontAttributeName as String):font,NSAttributedString.Key(kCTForegroundColorAttributeName as String):white])
  let line=CTLineCreateWithAttributedString(a),actual=CTLineGetTypographicBounds(line,nil,nil,nil)
  precondition(actual<=width,"Cover text exceeds width")
  let ty=top+CGFloat(i)*CGFloat(leading);c.textPosition=CGPoint(x:x,y:CGFloat(H)-ty-CTFontGetAscent(font));CTLineDraw(line,c)
  let bounds=CTLineGetBoundsWithOptions(line,[.useGlyphPathBounds])
  textBounds.append(["text":String(s),"left":x+max(0,bounds.minX),"top":ty,"right":x+actual,"bottom":ty+CTFontGetAscent(font)+CTFontGetDescent(font),"fontSize":size])
 }
}
let c=CGContext(data:nil,width:W,height:H,bitsPerComponent:8,bytesPerRow:W*4,space:cs,bitmapInfo:CGImageAlphaInfo.premultipliedLast.rawValue)!
c.setFillColor(cream);c.fill(CGRect(x:0,y:0,width:W,height:H))
let food=load(post["foodImage"] as! String),crop=post["imageCrop"] as! [Double]
let source=food.cropping(to:CGRect(x:Double(food.width)*crop[0],y:Double(food.height)*crop[1],width:Double(food.width)*(crop[2]-crop[0]),height:Double(food.height)*(crop[3]-crop[1])))!
let photoRect=rect(0,cg("pictureTop",layout),CGFloat(W),cg("pictureHeight",layout)),scale=max(photoRect.width/CGFloat(source.width),photoRect.height/CGFloat(source.height)),iw=CGFloat(source.width)*scale,ih=CGFloat(source.height)*scale
c.saveGState();c.clip(to:photoRect);c.interpolationQuality = .high
if post["imageRotation"] as! Int==180 {c.translateBy(x:photoRect.midX,y:photoRect.midY);c.rotate(by:.pi);c.draw(source,in:CGRect(x:-iw/2,y:-ih/2,width:iw,height:ih))}
else {c.draw(source,in:CGRect(x:photoRect.midX-iw/2,y:photoRect.midY-ih/2,width:iw,height:ih))};c.restoreGState()
c.setFillColor(accent);c.fill(rect(0,0,CGFloat(W),cg("headerHeight",layout)))
let gradient=CGGradient(colorsSpace:cs,colors:[accent,accent.copy(alpha:0)!] as CFArray,locations:[0,1])!
c.drawLinearGradient(gradient,start:CGPoint(x:0,y:photoRect.maxY),end:CGPoint(x:0,y:photoRect.maxY-cg("edgeFeatherPx",layout)),options:[])
text(c,"Bake Again.",layout["brand"] as! [String:Any],"brand")
text(c,post["eyebrow"] as! String,layout["eyebrow"] as! [String:Any],"body")
text(c,post["title"] as! String,layout["title"] as! [String:Any],"title")
let badge=try GlutenFreeBadge(configuration:root.appendingPathComponent(post["badgeConfiguration"] as? String ?? (layout["badgeConfiguration"] as! String)))
badge.drawThemed(c,time:2,animated:false,canvasHeight:CGFloat(H),accent:strong,cream:cream,font:CTFontCreateWithName(fonts["label"]! as CFString,badge.number("fontSize"),nil))
if (post["showMascot"] as? Bool ?? true) {
 if let mascotPath=post["mascot"] as? String {
let mascot=load(mascotPath),mb=layout["mascot"] as! [String:Any],mw=cg("width",mb)
 c.draw(mascot,in:rect(cg("x",mb),cg("top",mb),mw,mw*CGFloat(mascot.height)/CGFloat(mascot.width)))
}
}
let image=c.makeImage()!
func save(_ im:CGImage,_ url:URL,_ type:UTType,_ quality:Double=0.88){let dest=CGImageDestinationCreateWithURL(url as CFURL,type.identifier as CFString,1,nil)!;CGImageDestinationAddImage(dest,im,[kCGImageDestinationLossyCompressionQuality:quality] as CFDictionary);precondition(CGImageDestinationFinalize(dest))}
let id=post["id"] as! String
let version=post["version"] as? String ?? "v1"
save(image,output.appendingPathComponent("working/\(id)-cover-\(version)-master.png"),.png)
save(image,output.appendingPathComponent("\(id)-cover-\(version).jpg"),.jpeg)
for (name,crop) in layout["cropPreviews"] as! [String:[Int]] {
 let im=image.cropping(to:CGRect(x:crop[0],y:crop[1],width:crop[2]-crop[0],height:crop[3]-crop[1]))!
 save(im,output.appendingPathComponent("working/\(id)-\(name).jpg"),.jpeg)
 for box in textBounds {precondition((box["top"] as! CGFloat)>=CGFloat(crop[1]+32) && (box["bottom"] as! CGFloat)<=CGFloat(crop[3]-32),"Text outside simulated crop")}
 precondition(badge.number("endCenterTop")-badge.number("height")/2>=CGFloat(crop[1]+32),"Badge outside simulated crop")
}
let report:[String:Any]=["id":id,"canvas":[W,H],"textBounds":textBounds,"cropPreviews":layout["cropPreviews"]!,"importantTextInsideCrops":true,"fonts":fonts,"source":post["foodImage"]!,"sourceProvenance":post["sourceProvenance"]!,"foodShareOf3x4":Double(1680-784)/1440]
try JSONSerialization.data(withJSONObject:report,options:[.prettyPrinted,.sortedKeys]).write(to:output.appendingPathComponent("working/geometry-verification.json"))
print("Completed \(id) cover: 9:16 JPEG, source PNG, 3:4 / 4:5 previews")
