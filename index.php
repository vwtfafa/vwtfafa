<div class="main"><center>

	<div class="logo">
		<?php if ($LOGOAnimation) { ?>
			<img src="<?php echo($LOGO); ?>" width="35%" style="animation: classic8 5s infinite;">
		<?php } else { ?>
			<img src="<?php echo($LOGO); ?>" width="35%">
		<?php } ?>
		
	</div>
	
	<div class="nav">
		<ul class="nav justify-content-center">
		  <li class="nav-item" style="margin-right: -10%;">
			<a class="nav-link" aria-current="page" href="<?php echo($Item1URL); ?>"><img src="<?php echo($Item1Image); ?>"></a>
			  <h1 class="text-white" style="margin-top: -5%;"><?php echo($Item1Text); ?></h1>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="<?php echo($Item2URL); ?>"><img src="<?php echo($Item2Image); ?>"></a>
			 <h1 class="text-white" style="margin-top: -5%;"><?php echo($Item2Text); ?></h1>
		  </li>
		  <li class="nav-item" style="margin-left: -10%;">
			<a class="nav-link" href="<?php echo($Item3URL); ?>"><img src="<?php echo($Item3Image); ?>"></a>
			  <h1 class="text-white" style="margin-top: -5%;"><?php echo($Item3Text); ?></h1>
		  </li>
		</ul>
	</div>
	<div class="playercount">
			<!-- Replace play.cubecraft.net with your server IP address -->
			<!-- Do it on both line 66 and line 67 -->
			<!-- Please set both your IP and port -->
			<p><b><span class="sip text-danger" data-ip="<?php echo($ServerIP); ?>" data-port="<?php echo($ServerPort); ?>">
			</span> Spieler online! <br><br><span class="ip text-white btn btn-danger"><?php echo($ServerIP); ?></span></b></p>
		</div>
</center></div>