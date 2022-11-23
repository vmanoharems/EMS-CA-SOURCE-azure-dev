CREATE PROCEDURE [dbo].[GetUserSpecificTime]  --   GetUserSpecificTime 1
(
@UserID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;
	--declare @tz varchar(50);
	--if exists(select * from TimeZone where UserID=@UserID)
	-- begin
	--    select @tz=TimeDifference from TimeZone where UserID=@UserID 	
	--end
	--else
	--  begin
	--   set @tz='07:00'
	--  end 
	
select convert(varchar(10), dbo.tzfromUTC(getdate(),dbo.TZforProduction(default)),101) as TodayDate
 --  select Convert(varchar(10),(getdate())-cast(@tz as datetime),101)as TodayDate

END



GO