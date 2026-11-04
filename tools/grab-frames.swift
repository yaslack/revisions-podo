// Prend des images dans une vidéo finie (MP4), sans rien recalculer : 960×540, JPEG.
// usage: node tools/podo-frames.js VIDEO_PLAN EP | swift tools/grab-frames.swift VIDEO.mp4 DOSSIER
// (chaque ligne de l'entrée : « nom temps_en_secondes »)
import AVFoundation
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
gen.maximumSize = CGSize(width: 960, height: 540)
try? FileManager.default.createDirectory(atPath: a[2], withIntermediateDirectories: true)
while let line = readLine() {
  let p = line.split(separator: " ")
  guard p.count == 2, let s = Double(p[1]) else { continue }
  let img = try gen.copyCGImage(at: CMTime(seconds: s, preferredTimescale: 600), actualTime: nil)
  let out = URL(fileURLWithPath: "\(a[2])/\(p[0]).jpg")
  let d = CGImageDestinationCreateWithURL(out as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(d, img, [kCGImageDestinationLossyCompressionQuality: 0.78] as CFDictionary)
  CGImageDestinationFinalize(d)
  print("wrote \(p[0]).jpg")
}
