SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[InsertUpdateClosePeriod]    ---- exec InsertUpdateClosePeriod 1,'2016-01-01','2016-01-01','dfd',2,1
@CompanyId int,
@Status nvarchar(50),
@ClosePeriodId int,
@CreatedBy nvarchar(50)
,@EndPeriod date
AS
BEGIN
	
	SET NOCOUNT ON;
Declare @Type varchar(20)
Declare @Value varchar(20)
Declare @CompanyPeriod int
Declare @Start datetime
Declare @end Datetime
Declare @inter int

select @Type=PeriodStartType,@Value=DefaultValue,@inter=(case when DefaultValue='Weekly' then 7 else 15 end)  from Company  where CompanyID=@CompanyID
If @Status='Closed'
begin
UPDATE ClosePeriod set  Status = @Status,
                        ModifiedBy = @CreatedBy,EndPeriod=@EndPeriod
					    where CompanyId = @CompanyId and ClosePeriodId = @ClosePeriodId

UPDATE ClosePeriod set  PeriodStatus = 'Current',
                        ModifiedBy = @CreatedBy,StartPeriod=@EndPeriod,EndPeriod=(SELECT DATEADD(DAY,@inter, @EndPeriod))
					    where CompanyId = @CompanyId and PeriodStatus = 'Future'

select @Start=EndPeriod,@CompanyPeriod=CompanyPeriod  from ClosePeriod  where CompanyID=@CompanyID  and PeriodStatus = 'Current' and Status='Open'
set @CompanyPeriod=@CompanyPeriod+1;


If (@Value='Weekly')
begin
set @end=(SELECT DATEADD(DAY, 7, @Start))
end
else
begin
set @end=(SELECT DATEADD(DAY, 15, @Start))
end

INSERT INTO [dbo].[ClosePeriod]([CompanyId],[CompanyPeriod],[StartPeriod],[EndPeriod],[Status],[PeriodStatus],[CreatedBy])
     VALUES(@CompanyID,@CompanyPeriod,@Start,@End,'Open','Future',1)


end

else 
begin

UPDATE ClosePeriod set  Status = @Status,
                        ModifiedBy = @CreatedBy
					    where CompanyId = @CompanyId and ClosePeriodId = @ClosePeriodId
end

		  
End


GO