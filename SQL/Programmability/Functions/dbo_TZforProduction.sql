CREATE Function [dbo].[TZforProduction]
( 
@Prodid as int = null
)
returns int
as
begin
declare @return int;
declare @plusorminus bit=0;
declare @TZDiff varchar(3)='-08';

	select top(1) @TZDiff = left(TimeDifference,3) from TimeZone order by 1 desc;

	if left(@TZDiff,1) = '+' 
		begin
			set @plusorminus = 1;
			set @return = cast(right(@TZDiff,2) as int);
		end
	else if left(@TZDiff,1) = '-'
		begin
			set @return = - cast(right(@TZDiff,2) as int);
		end
	else 
		begin
			set @return = - cast(left(@TZDiff,2) as int);
		end

	--select top(1) @return 
	--	= case @plusorminus
	--		when 1 then
	--		when 0 then
	--	end
	--from TimeZone
	--order by 1 DESC

	--	-cast(left(TimeDifference,2) as int) from TimeZone order by 1 desc
 
	if @return is null 
	begin
		set @return = -8;
	end

	return @return;
end

GO