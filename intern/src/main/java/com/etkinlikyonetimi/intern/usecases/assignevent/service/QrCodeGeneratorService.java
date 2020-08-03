package com.etkinlikyonetimi.intern.usecases.assignevent.service;


import com.google.zxing.EncodeHintType;
import net.glxn.qrgen.javase.QRCode;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Locale;


public class QrCodeGeneratorService {
    public static BufferedImage generateQRCodeImage(String barcodeText) throws Exception {
        ByteArrayOutputStream stream = QRCode
                .from(barcodeText)
                .withHint(EncodeHintType.CHARACTER_SET, "UTF-8")
                .withSize(250, 250)
                .stream();
        ByteArrayInputStream bis = new ByteArrayInputStream(stream.toByteArray());
        return ImageIO.read(bis);
    }


}
