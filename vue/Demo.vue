<template>
	<Drop @run="run" />
</template>

<script type="text/javascript">
	import Drop from './Drop';

	export default {
		name:'Demo',
		components:{
			Drop
		},
		methods:{
			run(DropDnd){
				//do something
				DropDnd()
			}
		}
	}

</script>
