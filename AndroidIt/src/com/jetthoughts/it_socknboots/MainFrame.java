package com.jetthoughts.it_socknboots;

import android.os.Bundle;
import android.view.View;
import com.phonegap.*;

public class MainFrame extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index_android.html");
        super.appView.setVerticalScrollBarEnabled(false);
        super.appView.setVerticalScrollbarOverlay(false);
        super.appView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        /*getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN |
                    WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);*/
    }
}

